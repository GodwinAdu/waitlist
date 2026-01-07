module.exports = {
  apps: [
    {
      name: 'waitlist-app',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'backup-scheduler',
      script: 'npm',
      args: 'run backup schedule 24',
      env: {
        NODE_ENV: 'production'
      },
      restart_delay: 10000,
      max_restarts: 5
    }
  ]
}