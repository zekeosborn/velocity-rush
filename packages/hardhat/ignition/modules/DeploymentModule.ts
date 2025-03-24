import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';
import { parseUnits } from 'viem';

const DeploymentModule = buildModule('DeploymentModule', (m) => {
  // VelocityRushToken.sol
  const cap = parseUnits('10000000', 18);
  const initialSupply = parseUnits('1000000', 18);

  const velocityRushToken = m.contract('VelocityRushToken', [
    cap,
    initialSupply,
  ]);

  return { velocityRushToken };
});

module.exports = DeploymentModule;
