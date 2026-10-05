/** URL の組み立てを 1 か所にまとめ、ルート定義とリンクで食い違わないようにする */
export const paths = {
  home: '/',
  pagePattern: '/pages/:id',
  page: (id: number) => `/pages/${id}`,
}
