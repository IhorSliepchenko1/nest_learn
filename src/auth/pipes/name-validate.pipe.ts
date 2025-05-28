import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { User } from "@prisma/client";


@Injectable()
export class NameValidatePipe implements PipeTransform {
     transform(value: User, metadata: ArgumentMetadata) {
          if (metadata.type !== "body" || typeof value !== "object" || !value) {
               return value
          }
          value.name = value.name.trim()

          if (value.name === '') {
               throw new BadRequestException(`Пустые данные`);
          }
     }
}
