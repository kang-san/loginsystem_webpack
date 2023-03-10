const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const os = require('os')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const getAbsolutePath = (pathDir) => path.resolve(__dirname, pathDir)


module.exports = (_env, argv) => {
    const isProd = argv.mode === 'production'
    const isDev = !isProd

    return {
        entry: {
            main: './src/index.js',
        },
        output: {
            path: getAbsolutePath('dist'),
            filename: 'assets/js/[name].[contenthash:8].js',
            publicPath: '/',
        },
        mode: 'production',
        devtool: isDev && 'cheap-module-source-map',
        resolve: {
            extensions: ['.js', '.jsx', '.json'],
            alias: {
                '@components': getAbsolutePath('src/components/'),
                '@contexts': getAbsolutePath('src/contexts/'),
                '@hooks': getAbsolutePath('src/hooks/'),
                '@pages': getAbsolutePath('src/pages/'),
            },
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/i,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                cacheCompression: false,
                                envName: isProd ? 'production' : 'development'
                            }
                        }
                    ]
                },
                // CSS Module ([filename].module.css)
                {
                    test: /\.module\.css$/i,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                    ],
                },
                // Sass
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                // 2 => postcss-loader, sass-loader
                                importLoaders: 2,
                            },
                        },
                        'resolve-url-loader',
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                // ????????? ??????
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192,
                                name: 'assets/images/[name].[hash:8].[ext]',
                            }
                        }
                    ]
                },
                // ????????? ??????
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: 'assets/fonts/[name].[hash:8].[ext]',
                            },
                        },
                    ],
                },

            ],

        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].[contenthash:8].css',
                chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
            }),
            // ?????? ?????? ???????????? ???????????? ??????
            new webpack.EnvironmentPlugin({
                NODE_ENV: isDev ? 'development' : 'production'
            }),
            // ???????????? ???????????? ??????
            new HtmlWebpackPlugin({
                template: getAbsolutePath('public/index.html'),
                inject: true
            }),
            // ???????????? ???????????? ??????
            new CleanWebpackPlugin({
                // ???????????? ?????? ??????
                // dry ?????? ???: false
                // dry: true,
                // verbose ?????? ???: false
                verbose: true,
                // cleanOnceBeforeBuildPatterns ?????? ???: ['**/*']
                cleanOnceBeforeBuildPatterns: [
                    '**/*',
                    // build ?????? ?????? ?????? ?????? ???????????? ??????
                    path.resolve(process.cwd(), 'build/**/*')
                ]
            })

        ],
        optimization: {
            minimize: true,
            minimizer: [
                new CssMinimizerPlugin({
                    parallel: os.cpus().length - 1
                }),
            ],
        },
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 20000,
        //     minRemainingSize: 0,
        //     maxSize: 0,
        //     minChunks: 1,
        //     maxAsyncRequests: 30,
        //     maxInitialRequests: 20,
        //     enforceSizeThreshold: 50000,
        //     cacheGroups: {
        //         defaultVendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             priority: -10,
        //             reuseExistingChunk: true,
        //         },
        //         default: {
        //             minChunks: 2,
        //             priority: -10,
        //             reuseExistingChunk: true,
        //         },
        //     },
        // },
        // ?????? ?????? ??????
        devServer: {
            // dist ??????????????? ??? ????????? ?????? ????????? ????????? ??????
            // contentBase: path.resolve(__dirname, './dist'),
            // ????????? ?????? ??????
            // index: 'index.html',
            // ?????? ?????? ??????
            port: 4000,
            // ??? ?????? ??????(HMR) ????????? ??????
            hot: true,
            // gzip ?????? ?????????
            compress: true,
            // dist ??????????????? ?????? ?????? ??????
            // writeToDisk: true,
            // History ????????? ?????? ?????? ??????
            historyApiFallback: true,
            // ?????? ?????? ?????? ?????? ??????
            open: true,
            // ?????? ?????? ??????
            // overlay: true,
        },
    }
}
