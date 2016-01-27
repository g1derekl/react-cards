module.exports = {
  production: {
    client: {
      host: 'http://boxofcards-g1derekl.rhcloud.com'
    },
    server: {
      port: process.env.OPENSHIFT_NODEJS_PORT,
      host: process.env.OPENSHIFT_NODEJS_IP
    }
  },
  development: {
    client: {
      host: 'http://localhost:3000'
    },
    server: {
      port: 3000,
      host: 'localhost'
    }
  }
}