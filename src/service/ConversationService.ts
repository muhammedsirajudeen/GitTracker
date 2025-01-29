import ConversationRepositoryInstance, { IConversationRepository } from "@/app/repository/ConversationRepository";
import { Conversation, IConversation } from "@/models/Conversation";

interface IConversationService{
    getConversationsByFilter(userId:string,repositoryId:string):Promise<IConversation[]>
    createConversation(conversation:Conversation):Promise<IConversation|null>
}

class ConversationService implements IConversationService{
    _ConversationRepository:IConversationRepository
    constructor(ConversationRepository:IConversationRepository){
        this._ConversationRepository=ConversationRepository

    }
    async getConversationsByFilter(userId:string,repositoryId:string):Promise<IConversation[]>{
        return await this._ConversationRepository.getConversationsByFilter(userId,repositoryId)
    }
    async createConversation(conversation: Conversation): Promise<IConversation | null> {
        return await this._ConversationRepository.createConversation(conversation)
    }
}

const ConversationServiceInstance = new ConversationService(ConversationRepositoryInstance);
export default ConversationServiceInstance