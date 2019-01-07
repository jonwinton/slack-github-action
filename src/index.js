'use strict';

const https = require('https'),
  [ MSG ] = process.argv.slice(2);

/**
 * Given a base string, globally replace all target
 * values with a set value.
 *
 * @param  {String} str
 * @param  {String} target
 * @param  {String} val
 * @returns {String}
 */
function replaceInString(str, target, val) {
  // Escape reserved RegExp characters in the target to avoid weird mutations
  const re = new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  // Return string after replacements
  return str.replace(re, val);
}

/**
 * Given a string with env vars defined by square brackets,
 * interpolate the env vars into the string.
 *
 * @param   {String} str
 * @returns {String}
 */
function interpolate(str = '') {
  const matches = str.match(/\[(\w+?)\]/gi);

  // If we didn't find any values to interpolate, return string
  if (!matches) return str;

  // Reduce through the matches and return the string
  // with values interpolated from env vars
  return matches.reduce((acc, curr) => {
    const trimmed = curr.slice(1,-1),
      envVar = process.env[trimmed];

    // No env var? Return accumulator
    if (!envVar) return acc;
    return replaceInString(acc, curr, envVar)
  }, str);
}

/**
 * Returns an object of options for the request
 *
 * @param   {Object} data
 * @returns {Object}
 */
function buildOptions(data) {
  return {
    hostname: 'hooks.slack.com',
    port: 443,
    path: `${process.env.SLACK_PATH}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
}

/**
 * Send the request to Slack!
 *
 * @param {Object} msg
 */
function executeRequest(msg) {
  const data = JSON.stringify(msg),
    options = buildOptions(data),
    req = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`)

      res.on('data', (d) => {
        process.stdout.write(d);
      });
    });

  req.on('error', (error) => {
    console.error(error);
  });

  req.write(data);
  req.end();
}

/**
 * Interpolate env vars and make
 * sure the JSON is valid
 *
 * @param {String} str
 * @returns {Object|Error}
 */
function parseAndInterpolateArg(str) {
  const msg = interpolate(str);

  try {
    return JSON.parse(msg.replace('--arg=', ''));
  } catch (error) {
    throw new Error('Could not parse JSON message argument! Is it properly formatted?');
  }
}

// Run it all
executeRequest(parseAndInterpolateArg(MSG));
