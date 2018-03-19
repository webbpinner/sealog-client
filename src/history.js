import createHistory from 'history/createBrowserHistory';
import { ROOT_PATH } from './url_config';

const history = createHistory({basename: ROOT_PATH})

export default history 
