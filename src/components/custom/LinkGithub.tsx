import { Github } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { frontendUrl } from "@/lib/backendUrl";

export default function LinkGithub(){
    return(
        <div className="flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto bg-muted rounded-full p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Github className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Link Your GitHub Account</CardTitle>
            <CardDescription>
              Connect your GitHub account to enable seamless integration and access additional features.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={()=>{
                window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=${frontendUrl}/api/auth/github&scope=repo`;

            }} className="bg-[#2da44e] text-white hover:bg-[#2c974b] px-6">
              <Github className="mr-2 h-4 w-4" />
              Link GitHub
            </Button>
          </CardContent>
        </Card>
      </div>    
    )
}