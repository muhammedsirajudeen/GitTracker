import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextSummary } from "../tabs/FolderStructure"
import { Dispatch, SetStateAction } from "react"
import { Copy } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FolderStructureProps {
  textsummary: TextSummary[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function FolderStructureDialog({ textsummary, open, setOpen }: FolderStructureProps) {
    function copyHandler(){
        navigator.clipboard.writeText(JSON.stringify(textsummary, null, 2))
        toast({description: "Copied text summary",className:"bg-green-500 text-white"})
    }
    return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent  className="sm:max-w-[90vw] h-[90vh] bg-black">
        <DialogHeader>
        </DialogHeader>
        <Tabs defaultValue="tree" className="w-full">
          <TabsList>
            <TabsTrigger value="list">File List</TabsTrigger>
          </TabsList>
            <Copy onClick={copyHandler} color="grey" className="h-4 w-4 mt-2"  />            
          <TabsContent value="list">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {textsummary.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-background shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">{item.path}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}




