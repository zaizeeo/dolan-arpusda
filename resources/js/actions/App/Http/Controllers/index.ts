import BukuTamuController from './BukuTamuController'
import AuthController from './AuthController'

const Controllers = {
    BukuTamuController: Object.assign(BukuTamuController, BukuTamuController),
    AuthController: Object.assign(AuthController, AuthController),
}

export default Controllers