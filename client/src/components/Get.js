export async function get(url){
    return await fetch(url).then(data => {
        return data;
    });
}