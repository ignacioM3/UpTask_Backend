import mongoose, { Document, Schema, Types } from "mongoose";
import { taskStatus, TaskStatus } from "./TaskStatus";
import Note from "./Note";


export interface ITask extends Document {
    name: string;
    description: string
    project: Types.ObjectId
    status: TaskStatus
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[]
    notes: Types.ObjectId[]
}


export const taskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description:{
        type: String,
        trim: true,
        required: true
    },
    project: {
        type: Types.ObjectId,
        ref: 'Project'
    },
    status:{
        type: String,
        enum: Object.values(taskStatus),
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus),
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [{
        type: Types.ObjectId,
        ref: 'Note'
    }]

}, { timestamps: true})

//Middleware
taskSchema.pre('deleteOne',{document: true },   async function(){
    const taskId = this._id
    if(!taskId) return
    await Note.deleteMany({task: taskId})
}

)

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;