export const getJSONFromURL = async <TResponse, >(url: string, config: RequestInit = {}): Promise<TResponse> => {
    try {
        const response = await fetch(url, config);
        return await response.json();
    } catch (error) {
        // TODO: Adequate exceptions
        throw Error;
    }
}

export const sendPostOnURL = async <TResponse, >(
    url: string,
    data: any = {},
    config: RequestInit = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
    }
): Promise<TResponse> => {
    const requestOptions = {
        ...config,
        body: JSON.stringify(data),
    }
    try {
        const response = await fetch(url, requestOptions);
        return await response.json();
    } catch (error) {
        // TODO: Exceptions
        throw Error;
    }
}
