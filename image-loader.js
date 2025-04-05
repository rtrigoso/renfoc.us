export default function myImageLoader({ src }) {
    const env = process.env.NODE_ENV
    const githubUser = 'rtrigoso'
    const website = 'renfoc.us'

    let url = `https://raw.githubusercontent.com/${githubUser}/${website}/refs/heads/main/public`;
    if(env == "development"){
        url = '.'
    }

    return `${url}/${src}`
}   