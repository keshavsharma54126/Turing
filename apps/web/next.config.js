/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost','lh3.googleusercontent.com',"googleusercontent.com","github.com","google.com"],
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin-allow-popups'
                    }
                ],
            },
        ]
    },
};

export default nextConfig;
