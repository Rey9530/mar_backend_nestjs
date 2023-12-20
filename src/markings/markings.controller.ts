import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MarkingsService } from './markings.service';
import { CreateMarkingDto } from './dto/create-marking.dto';
import { UpdateMarkingDto } from './dto/update-marking.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/users/decorators';
import { HEADER_API_BEARER_AUTH } from 'src/common/const';
import { FilterDTO } from './dto/filter.dto';

@ApiTags('Markings')
@Controller('v1/markings')
@Auth()
@ApiBearerAuth(HEADER_API_BEARER_AUTH)
export class MarkingsController {
  constructor(private readonly markingsService: MarkingsService) { }

  @Post()
  create(@Body() createMarkingDto: CreateMarkingDto) {
    return this.markingsService.create(createMarkingDto);
  }

  @Get('list/contract/:id')
  getAllMarkings(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() filterDTO: FilterDTO 
  ) {
    return this.markingsService.getAllMarkings(id,filterDTO);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.markingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarkingDto: UpdateMarkingDto) {
    return this.markingsService.update(+id, updateMarkingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.markingsService.remove(+id);
  }
}
