import { UpdateCategoryInput } from '../../dto/update-category.input';

export class UpdateCategoryCommand {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly input: UpdateCategoryInput,
  ) {}
}
