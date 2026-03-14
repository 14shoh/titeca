import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async send(senderId: string, dto: CreateMessageDto): Promise<Message> {
    const message = this.messageRepository.create({
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
    });
    return this.messageRepository.save(message);
  }

  async getInbox(userId: string): Promise<Message[]> {
    return this.messageRepository.find({
      where: { receiverId: userId },
      order: { createdAt: 'DESC' },
      relations: ['sender'],
    });
  }

  async getConversation(userId: string, otherUserId: string): Promise<Message[]> {
    return this.messageRepository
      .createQueryBuilder('m')
      .where(
        '(m.senderId = :userId AND m.receiverId = :otherUserId) OR (m.senderId = :otherUserId AND m.receiverId = :userId)',
        { userId, otherUserId },
      )
      .orderBy('m.createdAt', 'ASC')
      .leftJoinAndSelect('m.sender', 'sender')
      .leftJoinAndSelect('m.receiver', 'receiver')
      .getMany();
  }

  async markRead(id: string, userId: string): Promise<Message> {
    await this.messageRepository.update({ id, receiverId: userId }, { isRead: true });
    return this.messageRepository.findOne({ where: { id } });
  }
}
