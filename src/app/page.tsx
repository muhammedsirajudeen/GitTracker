import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { frontendUrl } from "@/lib/backendUrl";
import { connectToDatabase } from "@/models/dbConnect";
import { Tabs } from "@radix-ui/react-tabs";
import { GitBranch, AlertCircle, DollarSign, FolderTree, MessageSquare, Bell, Github, User } from "lucide-react";

async function ServerAction() {
  await connectToDatabase(process.env.MONGODB_URI!)
}
export default function Home() {
  ServerAction()
  return (
    <div className="min-h-screen from-gray-100 to-gray-200 p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Git Tracker: Your GitHub Companion</h1>
        <p className="text-xl text-gray-600">Empowering hobbyist programmers to manage, collaborate, and innovate</p>
      </header>

      <Tabs defaultValue="features" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="demo">Demo</TabsTrigger>
          <TabsTrigger value="getStarted">Get Started</TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard
              icon={<GitBranch className="h-6 w-6" />}
              title="Repository-based Todo Lists"
              description="Attach tasks to your repositories and track your progress effortlessly."
            />
            <FeatureCard
              icon={<AlertCircle className="h-6 w-6" />}
              title="Contextual Issues"
              description="Create issues with code snippets and repository context for better understanding."
            />
            <FeatureCard
              icon={<DollarSign className="h-6 w-6" />}
              title="Bounty System"
              description="Add bounties to tasks and reward contributors who complete them."
            />
            <FeatureCard
              icon={<FolderTree className="h-6 w-6" />}
              title="Smart Code Summaries"
              description="Get folder summaries or convert entire codebases to text for LLM processing."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="AI-powered Repository Chat"
              description="Interact with an AI agent that understands your repository's context."
            />
            <FeatureCard
              icon={<Bell className="h-6 w-6" />}
              title="Advanced Notifications"
              description="Stay updated with a full-fledged notification system and inter-server communication."
            />
          </div>
        </TabsContent>

        <TabsContent value="demo">
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>Experience Git Tracker in action</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center text-white">
                Demo Video Placeholder
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="getStarted">
          <Card>
            <CardHeader>
              <CardTitle>Join Git Tracker Today</CardTitle>
              <CardDescription>Start managing your GitHub projects like a pro</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input placeholder="Your GitHub username" />
                <Input type="email" placeholder="Your email address" />
                <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">Choose your preferred sign-up method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full py-6 text-base font-medium" asChild>
                      <a href={`https://github.com/login/oauth/authorize?client_id=Ov23li0zclDZ7XsACEGa&redirect_uri=${frontendUrl}/api/auth/github&scope=repo`} className="flex items-center justify-center">
                        <Github className="w-5 h-5 mr-2" />
                        Continue with GitHub
                      </a>
                      
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                      </div>
                    </div>
                    <Button variant="default" className="w-full py-6 text-base font-medium" asChild>
                      <a href="/signup" className="flex items-center justify-center">
                        <User className="w-5 h-5 mr-2" />
                        Continue with Email
                      </a>
                    </Button>
                  </CardContent>
                </Card>              </form>
            </CardContent>
            <CardFooter className="text-sm text-gray-500">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: JSX.Element, title: string, description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{description}</p>
      </CardContent>
    </Card>
  )
}
