import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class CreateActivityLogDto {
  @ApiProperty() user: User;
  @ApiProperty() screen: string;
  @ApiProperty() log: LogModel[];
  @ApiProperty() date: number;
  @ApiProperty() objectModified: string;
}

export class LogModel {
  label: string;
  previousValue: string;
  newValue: string;
  action: string;
}
