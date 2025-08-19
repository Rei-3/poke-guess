export interface PokemonData {
    pokemonId: number;
    name: string;
    species: {
        name: string;
    };
    generation: {
        name: string;
    };
    cries: {
        latest: string;
    };
    picture: string;
    flavorTextEntries: string[];
    firstType: string;
}

//clues
export type ClueType = 'species' | 'generation' | 'type' | 'flavorText' | 'cry';
export interface Clues {
    clueType: ClueType;
    label: string;
    value: string | string[];
    order: number;
}

interface PokeApiPokemonResponse {
    id: number;
    name: string;
    species: {
        name: string;
        url: string;
    };
    cries: {
        latest: string;
    };
    sprites: {
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
}

interface PokeApiSpeciesResponse {
    generation: {
        name: string;
    };
    flavor_text_entries: Array<{
        flavor_text: string;
        language: {
            name: string;
        };
    }>;
}

class PokeApi {
    private static baseUrl = 'https://pokeapi.co/api/v2';

    // Fetch a pokemon by id or name and return the normalized PokemonData
    static async getPokemon(identifier: string | number): Promise<PokemonData> {
        // Fetch main pokemon data
        const pokemonResp = await fetch(`${this.baseUrl}/pokemon/${identifier}`);
        if (!pokemonResp.ok) throw new Error(`Failed to fetch pokemon: ${pokemonResp.status}`);
        const pokemonJson: PokeApiPokemonResponse = await pokemonResp.json();

        // Fetch species (contains generation and flavor texts)
        const speciesUrl = pokemonJson.species && pokemonJson.species.url
            ? pokemonJson.species.url
            : `${this.baseUrl}/pokemon-species/${pokemonJson.id}`;

        const speciesResp = await fetch(speciesUrl);
        if (!speciesResp.ok) throw new Error(`Failed to fetch species: ${speciesResp.status}`);
        const speciesJson: PokeApiSpeciesResponse = await speciesResp.json();

        // Extract English flavor text entries (clean whitespace) and dedupe while preserving order
        const flavorTexts = speciesJson.flavor_text_entries
            .filter(e => e.language?.name === 'en')
            .map(e => e.flavor_text.replace(/\f|\n|\r/g, ' ').replace(/\s+/g, ' ').trim());
        const seen = new Set<string>();
        const uniqueFlavorTexts: string[] = [];
        for (const t of flavorTexts) {
            if (!seen.has(t)) {
                seen.add(t);
                uniqueFlavorTexts.push(t);
            }
        }

        // Official artwork picture
        const picture = pokemonJson.sprites?.other?.['official-artwork']?.front_default ?? '';

        // First type
        const firstType = pokemonJson.types && pokemonJson.types.length > 0
            ? pokemonJson.types[0].type.name
            : '';

        // Try to guess a cry audio URL (will return empty string if not reachable)
        // We try a commonly used repository path first (raw GitHub); if that HEAD check fails we return empty string.
        const potentialCryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonJson.id}.ogg`;
        const cryExists = await this.urlExists(potentialCryUrl);
        const cryUrl = cryExists ? potentialCryUrl : '';

        return {
            pokemonId: pokemonJson.id,
            name: pokemonJson.name,
            species: { name: pokemonJson.species.name },
            generation: { name: speciesJson.generation.name },
            cries: { latest: cryUrl },
            picture,
            flavorTextEntries: uniqueFlavorTexts,
            firstType,
        };
    }

    // Helper: check if a URL exists using HEAD (best effort; may be affected by CORS)
    private static async urlExists(url: string): Promise<boolean> {
        try {
            const resp = await fetch(url, { method: 'HEAD' });
            return resp.ok;
        } catch (e) {
            // HEAD may be blocked by CORS on some hosts — fail gracefully
            return false;
        }
    }

}

export default PokeApi;