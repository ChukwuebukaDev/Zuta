import {prisma as db} from '@/lib/prisma';
export class KnowledgeService{
    async getKnowledge(brand:string,model:string,generation?:string){
        return db.carKnowledge.findFirst({
            where:{
                brand,
                model,
                generation,
            },
        })
    }
}