export async function loadData(path) {
    try {
        const res = await fetch(path)
        return await res.json()
    }
    catch (err) {
        console.log(err)
    }
}