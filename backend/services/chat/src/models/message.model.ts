import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFile {
  name: string;
  content: string;
}

export interface IArtifact {
  id: number;
  type: string;
  files: IFile[];
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  images?: string[];
  artifacts?: IArtifact[];
  createdAt: Date;
  updatedAt: Date;
}

const fileSchema = new mongoose.Schema({
  name: String,
  content: String
}, {
  _id: false
});

const artifactSchema = new mongoose.Schema({
  id: Number,
  type: String,
  files: [fileSchema]
}, {
  _id: false
});

const messageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    artifacts: {
      type: [artifactSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Message: Model<IMessage> = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
