import {
  ExecutionContext, // 현재 실행 중인 요청 컨텍스트를 관리하는 클래스
  InternalServerErrorException, // 서버 내부 오류를 나타내는 예외 클래스
  createParamDecorator, // 커스텀 파라미터 데코레이터를 생성하는 유틸리티 함수
} from '@nestjs/common';

export const QueryRunner = createParamDecorator(
  (data, context: ExecutionContext) => {
    // 커스텀 데코레이터의 기본 함수, data는 추가 인수, context는 실행 컨텍스트
    const req = context.switchToHttp().getRequest(); // HTTP 요청 객체를 가져옴

    if (!req.queryRunner) {
      // 요청 객체에 queryRunner가 없으면
      throw new InternalServerErrorException(
        `QueryRunner Decorator를 사용하려면 TransactionInterceptor를 적용해야합니다`, // 예외를 던져 트랜잭션이 필요하다는 것을 알림
      );
    }

    return req.queryRunner; // queryRunner가 있으면 이를 반환
  },
);
