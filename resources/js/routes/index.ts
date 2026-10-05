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
