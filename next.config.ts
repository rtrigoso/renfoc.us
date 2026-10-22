import nextMdx from '@next/mdx'

const withMdx = nextMdx({
  extension: /\.mdx?$/,
  options: {/* otherOptions… */}
})

const nextConfig = withMdx({
  pageExtensions: ['md', 'mdx', 'tsx', 'ts', 'jsx', 'js'],
  transpilePackages: ['next-mdx-remote'],
  output: "export",
  experimental: {
    cssChunking: true,
    optimizeCss: true
  }
})

export default nextConfig
