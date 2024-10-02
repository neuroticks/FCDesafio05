import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const l_transacaoAprovada = new Transaction({
  id: new Id("1"),
  amount: 100,
  orderId: "1",
  status: "approved",
});

const l_mockRepositorio_TransAprovada = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(l_transacaoAprovada)),
  };
};

const l_transacaoReprovada = new Transaction({
  id: new Id("1"),
  amount: 50,
  orderId: "1",
  status: "declined",
});

const l_mockRepositorio_TransReprovada = () => {
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(l_transacaoReprovada)),
  };
};

describe("Process payment usecase unit test", () => {
  it("should approve a transaction", async () => {
    const paymentRepository = l_mockRepositorio_TransAprovada();
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(l_transacaoAprovada.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(l_transacaoAprovada.createdAt);
    expect(result.updatedAt).toBe(l_transacaoAprovada.updatedAt);
  });

  it("should decline a transaction", async () => {
    const paymentRepository = l_mockRepositorio_TransReprovada();
    const usecase = new ProcessPaymentUseCase(paymentRepository);

    const input = {
      orderId: "1",
      amount: 50,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(l_transacaoReprovada.id.id);
    expect(paymentRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(50);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toBe(l_transacaoReprovada.createdAt);
    expect(result.updatedAt).toBe(l_transacaoReprovada.updatedAt);
  });
});
