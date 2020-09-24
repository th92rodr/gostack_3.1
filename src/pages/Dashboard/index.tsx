import React, { useState, useEffect } from 'react';

import total from '../../assets/total.svg';
import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface APIResponse {
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
  transactions: Array<{
    id: string;
    title: string;
    value: number;
    type: 'income' | 'outcome';
    created_at: Date;
    category: {
      title: string;
    };
  }>;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const {
        data: { balance, transactions },
      } = await api.get<APIResponse>('transactions');

      const loadedTransactions: Transaction[] = transactions.map(
        transaction => {
          const { id, title, value, type, created_at, category } = transaction;
          const date = new Date(created_at);
          const formattedDate = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;

          return {
            id,
            title,
            value,
            formattedValue: formatValue(value),
            formattedDate,
            type,
            category: {
              title: category.title,
            },
            created_at: date,
          };
        },
      );

      setBalance({
        income: formatValue(balance.income),
        outcome: formatValue(balance.outcome),
        total: formatValue(balance.total),
      });

      setTransactions(loadedTransactions);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt='Income' />
            </header>
            <h1 data-testid='balance-income'>{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt='Outcome' />
            </header>
            <h1 data-testid='balance-outcome'>{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt='Total' />
            </header>
            <h1 data-testid='balance-total'>{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className='title'>{transaction.title}</td>
                  {transaction.type === 'income' ? (
                    <td className='income'>{transaction.formattedValue}</td>
                  ) : (
                    <td className='outcome'>- {transaction.formattedValue}</td>
                  )}
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
