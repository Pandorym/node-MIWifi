import { equal } from 'assert';
import { MIWifi } from '../src/MIWifi';
import * as readline from 'readline';

describe('MIWifi', function() {

  it('Login', (done) => {
    const rl = readline.createInterface({
      input : process.stdin,
      output : process.stdout
    });

    rl.question('> Input admin password: ', async (answer) => {
      rl.close();
      let password = answer.trim();

      await MIWifi.Login(password);
      equal(MIWifi.Password, password);
      equal(typeof MIWifi.key, 'string');
      equal(typeof MIWifi.iv, 'string');
      equal(typeof MIWifi.deviceId, 'string');
      equal(typeof MIWifi.Stok, 'string');
      done();

    });
  }).timeout(60 * 1000);
});
