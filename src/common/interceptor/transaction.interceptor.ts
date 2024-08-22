import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();

    // 트랜잭션과 관련된 모든 쿼리를 담당할 쿼리 러너를 생성한다.
    const qr = this.dataSource.createQueryRunner();

    // 쿼리 러너에 연결한다.
    await qr.connect();

    // 쿼리 러너에서 트랜잭션을 시작한다.
    await qr.startTransaction();

    req.queryRunner = qr;

    return next.handle().pipe(
      catchError(async (e) => {
        console.error('TransactionInterceptor - Error occurred:', e.message);
        console.error('TransactionInterceptor - Stack trace:', e.stack);

        await qr.rollbackTransaction();
        await qr.release();

        throw new InternalServerErrorException(e.message);
      }),
      tap(async () => {
        try {
          await qr.commitTransaction();
        } catch (commitError) {
          console.error(
            'TransactionInterceptor - Commit error:',
            commitError.message,
          );
          console.error(
            'TransactionInterceptor - Stack trace:',
            commitError.stack,
          );
          await qr.rollbackTransaction();
          throw new InternalServerErrorException('Transaction commit failed');
        } finally {
          await qr.release();
        }
      }),
    );
  }
}
