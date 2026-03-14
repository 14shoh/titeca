import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  send(@CurrentUser('id') senderId: string, @Body() dto: CreateMessageDto) {
    return this.messagesService.send(senderId, dto);
  }

  @Get('inbox')
  getInbox(@CurrentUser('id') userId: string) {
    return this.messagesService.getInbox(userId);
  }

  @Get('conversation/:userId')
  getConversation(@CurrentUser('id') myId: string, @Param('userId') otherUserId: string) {
    return this.messagesService.getConversation(myId, otherUserId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.messagesService.markRead(id, userId);
  }
}
