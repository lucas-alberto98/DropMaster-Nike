import AuthenticationService from '../../services/AuthenticationService';

export default (_event: any, arg: any) => AuthenticationService.getUsername();
