let defaultTarget = 'https://api.first.org/';
module.exports = [
   {
      context: ['/data/v1/countries/**'],
      target: defaultTarget,
      changeOrigin: true,
   }
];