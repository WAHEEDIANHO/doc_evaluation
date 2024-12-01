import { PartialType } from '@nestjs/swagger';
import { CreateDocEnvDto } from './create-doc_env.dto';

export class UpdateDocEnvDto extends PartialType(CreateDocEnvDto) {}
