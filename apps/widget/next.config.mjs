/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui",
    "@radix-ui/react-use-controllable-state"
  ],
}

export default nextConfig
