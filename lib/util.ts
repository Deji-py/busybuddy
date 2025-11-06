import { storage } from './config/storage';

const IS_ONBOARDED = 'is_onboarded';

const isOnboarded = () => {
  return storage.getBoolean(IS_ONBOARDED) === true;
};
const setOnboarded = () => {
  storage.set(IS_ONBOARDED, true);
};

export { isOnboarded, setOnboarded };
