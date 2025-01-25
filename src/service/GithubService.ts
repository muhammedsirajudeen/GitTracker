import axios from "axios";


enum GithubUrls{
    user="https://api.github.com/user",
    base_url="https://api.github.com",
}

interface PullRequest{
    user:{
        login:string
    }
    merged_at:string|null
}
interface IGithubService{
    getPullRequestByRepoOfToken(token:string,repo:string):Promise<PullRequest[]>
    getUserGivenToken(token:string):Promise<string>
}

class GithubService implements  IGithubService{
    constructor() {
    }
    // async getUser(token:string){

    // }
    async getPullRequestByRepoOfToken(token: string, repo: string): Promise<PullRequest[]> {
        try {
            //perform the necessary network requests and all here
            const user=await this.getUserGivenToken(token)
            const prResponse=await axios.get(`${GithubUrls.base_url}/repos/${repo}/pulls?state=closed`,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    }
                }
            )
            const prOfUser:PullRequest[]=[]
            prResponse.data.forEach((pr:PullRequest)=>{
                if(pr.user.login===user && pr.merged_at!==null){
                    prOfUser.push(pr)
                }
            })
            return prOfUser
        }catch (error) {
            const serviceError=error as Error
            console.log(serviceError.message)
            return []
        }
    }

    async getUserGivenToken(token: string): Promise<string> {
        try {
            const userResponse=await axios.get(
                GithubUrls.user,
                {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            return userResponse.data.login as string
        }catch (e) {
            const serviceError=e as Error
            console.log(serviceError.message)
            return ""
        }
    }

}
const GithubServiceInstance=new GithubService()
export default GithubServiceInstance