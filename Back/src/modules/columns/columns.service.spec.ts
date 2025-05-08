import { Test, TestingModule } from '@nestjs/testing';
import { ColumnsService } from './columns.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ColumnsService', () => {
  let service: ColumnsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColumnsService,
        {
          provide: getModelToken('Column'),
          useValue: {
            find: jest
              .fn()
              .mockReturnValue({ populate: jest.fn().mockResolvedValue([]) }),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ColumnsService>(ColumnsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
