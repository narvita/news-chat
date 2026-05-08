export const tools = [
    {
        type: 'function',
        function: {
            name: 'search_news',
            description:
                'Search for the latest news articles on a topic. Only call this when the user is explicitly asking about news, current events, or recent happenings — not for general conversation or questions you can answer directly.',
            parameters: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                    },
                },
                required: ['query'],
            },
        },
    },
];