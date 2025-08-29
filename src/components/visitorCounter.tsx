import React from "react";

interface VisitorCounterState {
    visitorCount: number;
    loading: boolean;
    error: string | null;
}

class VisitorCounter extends React.Component<{}, VisitorCounterState> {
    
    constructor(props: {}) {
        super(props);
        this.state = {
            visitorCount: 0,
            loading: true,
            error: null
        };
    }
    componentDidMount() {
        this.fetchVisitorCount();
    }

    fetchVisitorCount = async () => {
        try {
            const response = await fetch("https://api.countapi.xyz/hit/pokemon-guess-v1.vercel.app/visits");
            if (!response.ok) {
                throw new Error('Failed to fetch visitor count');
            }
            const data = await response.json();
            this.setState({ 
                visitorCount: data.value,
                loading: false,
                error: null
            });
        } catch (error) {
            console.error('Error fetching visitor count:', error);
            this.setState({ 
                loading: false,
                error: 'Unable to load visitor count'
            });
        }
    }

    render() {
        const { visitorCount, loading, error } = this.state;

        return (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700">Visitors</h3>
                        {loading ? (
                            <div className="text-lg font-bold text-gray-600">Loading...</div>
                        ) : error ? (
                            <div className="text-sm text-red-500">{error}</div>
                        ) : (
                            <div className="text-lg font-bold text-blue-600">
                                {visitorCount.toLocaleString()}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default VisitorCounter;