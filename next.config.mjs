/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        domains:["pixcap.com","res.cloudinary.com"]
    },
    serverRuntimeConfig: {
        maxRequestTimeout: 10 * 60 * 1000, // 10 minutes
      },
    
    
};

export default nextConfig;
