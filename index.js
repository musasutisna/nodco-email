const nodemailer = require('nodemailer');

/**
 * Create a new configuration email.
 *
 * @param   object
 * @return  object
 */
module.exports = function nodcoEmailConfig(config = {}) {
  /**
   * Email transporter
   */
  const transporter = {};

  /**
   * Start email connection.
   *
   * @param   string
   * @param   callback
   * @return  void
   */
  async function connect(key, cb) {
    try {
      const option = config[key];

      transporter[key] = nodemailer.createTransport({
        host: option.host,
        port: option.port,
        secure: option.secure,
        pool: option.pool,
        auth: {
          type: 'custom',
          method: 'MY-CUSTOM-METHOD',
          user: option.username,
          pass: option.password
        },
        customAuth: {
          'MY-CUSTOM-METHOD': customEmailMethod
        }
      });

      console.log(`email connected "${key}"`);

      if (cb) cb();
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  }

  /**
   * Custom mail method.
   *
   * @param   object
   * @return  void
   */
  async function customEmailMethod(ctx){
    const cmd = await ctx.sendCommand(
      'AUTH PLAIN ' +
      Buffer.from(
        '\u0000' + ctx.auth.credentials.user + '\u0000' + ctx.auth.credentials.pass,
        'utf-8'
      ).toString('base64')
    );

    if (cmd.status < 200 || cmd.status >= 300){
      throw new Error('Failed to authenticate user: ' + cmd.text);
    }
  }

  /**
   * Close all connection.
   *
   * @return  void
   */
  async function close() {
    for (var key in config) {
      await transporter[key].close();

      console.log(`email disconnect "${key}"`);
    }
  }

  /**
   * Send email.
   *
   * @param   string
   * @param   object
   * @return  void
   */
  async function send(key, payload) {
    payload = {
      ...payload,
      ...config[key].options
    };

    return new Promise((resolve, reject) => {
      transporter[key].sendMail(payload)
        .then((info) => {
          // accepted/rejected message time/message size/message id (response)
          resolve(`${info.accepted.toString() || 'none'}/${info.rejected.toString() || 'none'} ${info.messageTime}/${info.messageSize}/${info.messageId} (${info.response})`)
        })
        .catch(reject);
    });
  }

  return {
    connect,
    close,
    send
  };
};
