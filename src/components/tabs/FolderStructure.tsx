'use client'

import { toast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "../RepositoryListing"
import { Button } from "../ui/button"
import { Loader2, File, Folder, ChevronRight, ChevronDown, Copy } from 'lucide-react'
import { useState, useMemo } from "react"
import axios from "axios"
import { ClipLoader } from "react-spinners"
import FolderStructureDialog from "../dialog/FolderStructureDialog"

interface GitTreeItem {
    path: string
    mode: string
    type: string
    sha: string
    size: number
    url: string
}

interface FolderStructureResponse {
    status: number
    paths: GitTreeItem[]
}

interface TreeNode {
    name: string
    type: 'tree' | 'blob'
    children: TreeNode[]
    item: GitTreeItem
}
export interface TextSummary{
    path:string
    content:string
}
//look more into the nuances of this structure
function buildTree(items: GitTreeItem[]): TreeNode[] {
    const root: TreeNode = { name: '', type: 'tree', children: [], item: {} as GitTreeItem }
    
    items.forEach(item => {
        const parts = item.path.split('/')
        let currentNode = root
        
        parts.forEach((part, index) => {
            let child = currentNode.children.find(c => c.name === part)
            if (!child) {
                child = {
                    name: part,
                    type: index === parts.length - 1 ? item.type as 'tree' | 'blob' : 'tree',
                    children: [],
                    item: index === parts.length - 1 ? item : {} as GitTreeItem
                }
                currentNode.children.push(child)
            }
            currentNode = child
        })
    })
    
    return root.children
}

function sortTree(node: TreeNode): TreeNode {
    node.children.sort((a, b) => {
        if (a.type === 'tree' && b.type !== 'tree') return -1
        if (a.type !== 'tree' && b.type === 'tree') return 1
        return a.name.localeCompare(b.name)
    })
    node.children.forEach(sortTree)
    return node
}

function TreeItem({ node, level = 0 }: { node: TreeNode; level?: number }) {
    const [isOpen, setIsOpen] = useState(level < 2)
    const isFolder = node.type === "tree"

    return (
        <div className={`ml-${level * 4}`}>
            <div 
                className={`flex items-center py-1 cursor-pointer rounded ${isFolder ? 'font-semibold' : ''}`}
                onClick={() => isFolder && setIsOpen(!isOpen)}
            >
                <span className="mr-2">
                    {isFolder ? (
                        isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                    ) : null}
                </span>
                {isFolder ? <Folder size={16} className="mr-2 text-blue-500" /> : <File size={16} className="mr-2 text-gray-500" />}
                <span>{node.name}</span>
                {!isFolder && <span className="ml-2 text-xs text-gray-500">({node.item.size} bytes)</span>}
            </div>
            {isOpen && isFolder && (
                <div>
                    {node.children.map((child, index) => (
                        <TreeItem key={child.name + index} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )
}


export default function FolderStructure() {
    const { id } = useParams()
    const { data, error, isLoading } = useSWR<FolderStructureResponse>(`/api/folderstructure/${id}`, fetcher)
    const [loading,setLoading]=useState<boolean>(false)
    const [textsummary,setTextsummary] = useState<TextSummary[]>([])
    const [summarydialog,setSummarydialog] = useState<boolean>(false)
    const treeData = useMemo(() => {
        if (data?.paths) {
            const tree = buildTree(data.paths)
            return tree.map(sortTree)
        }
        return []
    }, [data?.paths])



    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-red-500">
                Error loading folder structure. Please try again.
            </div>
        )
    }

    if (!data || data.paths.length === 0) {
        return (
            <div className="text-center text-gray-500">
                No folder structure data available.
            </div>
        )
    }
    async function textSummary() {
        setLoading(true)
        try {
            const response=await axios.put(`/api/folderstructure/${id}`,{},{withCredentials:true})
            console.log(response.data)
            setTextsummary(response.data.filecontents as TextSummary[])
            setSummarydialog(true)
            toast({
                title: "Summary Generated",
                description: "Text Summary generated successfully",
                className: "bg-green-500 text-white",
            })                
        } catch (error) {
            console.log(error)
            toast({
                title:"Error",
                description: "Failed to generate text summary",
                className: "bg-red-500 text-white",
            })
        }
        setLoading(false)
    }
    function copyHandler(){
        const paths=data?.paths.map((item)=>item.path) ?? []
        navigator.clipboard.writeText(paths.join('\n ')).then(() => {
            console.log('Text copied to clipboard');
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
        toast({description: "Copied to clipboard", className: "bg-blue-500 text-white",})
    }
    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-center w-full">
                <Button onClick={textSummary} >
                    {
                        loading ?
                        <ClipLoader size={10}/>
                        :
                        <p>Generate Text Summary</p>
                        

                    }
                </Button>
            </div>
            <div className="shadow rounded-lg p-4 mb-4 max-h-[60vh] overflow-auto">
                <Copy onClick={copyHandler} color="grey" className="h-3 w-3" />
                {treeData.map((node, index) => (
                    <TreeItem key={node.name + index} node={node} />
                ))}
            </div>
            <FolderStructureDialog open={summarydialog} setOpen={setSummarydialog}  textsummary={textsummary} />
        </div>
    )
}

