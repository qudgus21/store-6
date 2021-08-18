import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import UserRepository, { EditableUserInfo, UserInfo } from '@/repository/user';
import * as hashHelper from '@/helper/hash';
import LoginRepository, { LoginInfo } from '@/repository/login';
import ErrorResponse from '@/utils/errorResponse';
import {
  commonError,
  userCreateError,
  userDeleteError,
  userUpdateError,
} from '@/constants/error';
import UserEntity from '@/entity/user';
import LoginEntity from '@/entity/login';
import * as validationHelper from '@/helper/validation';

interface EditableUser extends EditableUserInfo {
  password?: string;
}

@Service()
class UsersService {
  private loginRepository: LoginRepository;

  private userRepository: UserRepository;

  constructor(
    @InjectRepository(LoginRepository) loginRepository: LoginRepository,
    @InjectRepository(UserRepository) userRepository: UserRepository,
  ) {
    this.loginRepository = loginRepository;
    this.userRepository = userRepository;
  }

  async createUser({ id, password, type, email, phone }: UserInfo & LoginInfo) {
    try {
      if (
        !validationHelper.idValidator(id) ||
        !validationHelper.pwValidator(password) ||
        !validationHelper.phoneValidator(phone) ||
        !validationHelper.emailValidator(email)
      ) {
        throw new ErrorResponse(commonError.badRequest);
      }

      const alreadyCreatedLogin = await this.loginRepository.findById(id);
      if (alreadyCreatedLogin) {
        throw new ErrorResponse(userCreateError.alreadyExists);
      }

      const login = new LoginEntity();
      const hashedPassword = hashHelper.generateHash(password);
      login.password = hashedPassword;
      login.id = id;
      if (type) {
        login.type = type;
      }

      const user = new UserEntity();
      user.email = email;
      user.phone = phone;
      user.login = login;

      const { updatedUser } =
        await this.userRepository.transactionSaveWithLogin(user, login);

      const { idx, createdAt, updatedAt } = updatedUser;
      return { idx, createdAt, updatedAt };
    } catch (e) {
      if (e instanceof ErrorResponse) {
        throw e;
      }
      throw new ErrorResponse(userCreateError.unable);
    }
  }

  async updateUser(
    idx: number,
    { password, email, phone, profile }: EditableUser,
  ) {
    try {
      const user = await this.userRepository.findByIdxWithLogin(idx);
      const login = user?.login;
      if (!user || !login) {
        throw new ErrorResponse(commonError.unauthorized);
      }
      if (password) {
        const hashedPassword = hashHelper.generateHash(password);
        login.password = hashedPassword;
      }
      user.email = email ?? user.email;
      user.phone = phone ?? user.phone;
      user.profile = profile ?? user.profile;

      const { updatedUser } =
        await this.userRepository.transactionSaveWithLogin(user, login);
      const { createdAt, updatedAt } = updatedUser;
      return { idx: updatedUser.idx, createdAt, updatedAt };
    } catch (e) {
      if (e instanceof ErrorResponse) {
        throw e;
      }
      throw new ErrorResponse(userUpdateError.unable);
    }
  }

  async deleteUser(idx: number) {
    try {
      const user = await this.userRepository.findByIdxWithLogin(idx);
      if (!user || !user.login) {
        throw new ErrorResponse(commonError.unauthorized);
      }
      this.loginRepository.removeByIdx(user.login.idx);
    } catch (e) {
      if (e instanceof ErrorResponse) {
        throw e;
      }
      throw new ErrorResponse(userDeleteError.unable);
    }
  }
}

export default UsersService;
