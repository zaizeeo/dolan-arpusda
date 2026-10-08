import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../wayfinder'
/**
* @see routes/web.php:24
* @route '/'
*/
export const homePage = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: homePage.url(options),
    method: 'get',
})

homePage.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:24
* @route '/'
*/
homePage.url = (options?: RouteQueryOptions) => {
    return homePage.definition.url + queryParams(options)
}

/**
* @see routes/web.php:24
* @route '/'
*/
homePage.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: homePage.url(options),
    method: 'get',
})

/**
* @see routes/web.php:24
* @route '/'
*/
homePage.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: homePage.url(options),
    method: 'head',
})

/**
* @see routes/web.php:24
* @route '/'
*/
const homePageForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: homePage.url(options),
    method: 'get',
})

/**
* @see routes/web.php:24
* @route '/'
*/
homePageForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: homePage.url(options),
    method: 'get',
})

/**
* @see routes/web.php:24
* @route '/'
*/
homePageForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: homePage.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

homePage.form = homePageForm

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/auth',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:13
* @route '/auth'
*/
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: login.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

login.form = loginForm

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:49
* @route '/api/auth/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/auth/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:49
* @route '/api/auth/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:49
* @route '/api/auth/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:49
* @route '/api/auth/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AuthController::login
* @see app/Http/Controllers/AuthController.php:49
* @route '/api/auth/login'
*/
loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

login.form = loginForm
