import BountyModel, { Bounty, IBounty } from "@/models/Bounty"
import mongoose, { Model } from "mongoose"
import BaseRepository from "./BaseRepository";

export interface IBountyRepository {
    addBounty: (bounty: Bounty) => Promise<Bounty | null>;
    getBounties: (repositoryId: string) => Promise<Bounty[] | null>;
    getBountyByIssueId: (issueId: string) => Promise<boolean>
    deleteBountyById: (id: string) => Promise<boolean>
    getBountyById: (id: string) => Promise<Bounty | null>
    getAllBounties: (userId: string) => Promise<Bounty[] | null>
    addAssignee: (userid: string, bountyid: string) => Promise<boolean>
    getBountyByAssignee: (userid: string) => Promise<Bounty[] | null>
    getAdminBounties: (page: number) => Promise<Bounty[] | null>
    getTotalAmount: () => Promise<number>
}

class BountyRepository extends BaseRepository implements IBountyRepository {
    _BountyModel: Model<IBounty>
    constructor(BountyModel: Model<IBounty>) {
        super()
        this._BountyModel = BountyModel
    }
    async getAdminBounties(page: number): Promise<Bounty[] | null> {
        return await this._BountyModel.find().populate(
            [
                {
                    path: 'assignees',
                    select: 'email avatar_url'
                },
                {
                    path: 'ownerId',
                    select: 'email avatar_url'
                },
                {
                    path: 'repositoryId'
                }
            ]
        ).limit(this.PAGE_LIMIT).skip(page * this.PAGE_LIMIT) as Bounty[]
    }
    async addBounty(bounty: Bounty): Promise<Bounty | null> {
        try {
            const newBounty = new this._BountyModel(bounty)
            return await newBounty.save()
        } catch (error) {
            console.log(error)
            return null
        }
    };
    //pass the owner id here too
    async getBounties(repositoryId: string): Promise<Bounty[] | null> {
        return await this._BountyModel.find({ repositoryId: new mongoose.Types.ObjectId(repositoryId) }).populate('assignees') as Bounty[]

    }
    async getBountyByIssueId(issueId: string): Promise<boolean> {
        const bounty = await this._BountyModel.findOne({ issueId })
        return !!bounty;
    }
    async deleteBountyById(bountyId: string): Promise<boolean> {
        try {
            await this._BountyModel.deleteOne({ _id: bountyId })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    };
    async getBountyById(id: string): Promise<Bounty | null> {
        return await this._BountyModel.findById(id)
    }
    async getAllBounties(userid: string): Promise<Bounty[] | null> {
        return await this._BountyModel.find({ ownerId: { $ne: new mongoose.Types.ObjectId(userid) } })
            .populate({ path: 'repositoryId' })
            .populate({ path: 'ownerId', select: 'email avatar_url' }) as Bounty[]
    }
    async addAssignee(userid: string, bountyid: string): Promise<boolean> {
        try {
            console.log("from inside assignee repo", userid)
            await this._BountyModel.updateOne(
                { _id: bountyid },
                { $addToSet: { assignees: new mongoose.Types.ObjectId(userid) } }
            );
            return true
        } catch (error) {
            console.log(error)
            this._logger.error(error)
            return false
        }
    }
    async getBountyByAssignee(userid: string) {
        return await this._BountyModel.find({ assignees: { $in: [new mongoose.Types.ObjectId(userid)] } }).populate('repositoryId')
            .populate('ownerId') as unknown as Bounty[]
    }
    async getTotalAmount() {
        try {
            const result = await this._BountyModel.aggregate([
                {
                    $group: {
                        _id: null, // Grouping by `null` means all documents are grouped together
                        totalBountyAmount: { $sum: "$bountyAmount" },
                    },
                },
            ]);

            return result.length > 0 ? result[0].totalBountyAmount : 0;
        } catch (error) {
            const repoError = error as Error
            this._logger.error(repoError.message)
            return 0
        }
    }

}

const BountyRepositoryInstance = new BountyRepository(BountyModel)
export default BountyRepositoryInstance