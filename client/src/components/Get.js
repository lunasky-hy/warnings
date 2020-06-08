export async function get(url){
    return await fetch(url).then(data => {
        return data;
    }).catch(err => {
        console.log(err);
        return {err: "error"};
    });
}