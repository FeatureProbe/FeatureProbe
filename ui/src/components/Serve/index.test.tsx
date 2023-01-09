import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Serve from '.';
import { hooksFormContainer } from 'pages/toggle/provider';
import { IntlWrapper } from 'components/utils/wrapper';
import { IVariation } from 'interfaces/targeting';

const Wrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>{props.children}</hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

const variations: IVariation[] = [
  {
    id: '1',
    value: 'true',
    name: 'Variation 1',
    description: 'This is a description',
  },
  {
    id: '2',
    value: 'false',
    name: 'Variation 2',
    description: 'This is a description',
  },
];

it('Serve snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <Serve variations={[]} handleChangeServe={jest.fn()} hooksFormContainer={hooksFormContainer} />,
      {
        wrapper: Wrapper,
      }
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(<Serve variations={variations} handleChangeServe={jest.fn()} hooksFormContainer={hooksFormContainer} />);
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <Serve
        disabled={true}
        variations={variations}
        serve={{ split: [0, 0], select: 2 }}
        handleChangeServe={jest.fn()}
        hooksFormContainer={hooksFormContainer}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <Serve
        disabled={false}
        variations={variations}
        serve={{ select: 0 }}
        handleChangeServe={jest.fn()}
        hooksFormContainer={hooksFormContainer}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

test('Serve select', (done) => {
  (async () => {
    const mockHandleChangeServe = jest.fn();

    const { asFragment } = render(
      <Serve
        variations={variations}
        handleChangeServe={mockHandleChangeServe}
        hooksFormContainer={hooksFormContainer}
      />,
      {
        wrapper: Wrapper,
      }
    );
    const selectEle = screen.getByText('Please select serve');
    await userEvent.click(selectEle);
    const options = screen.getAllByRole('option');
    await userEvent.click(options[0]);

    expect(mockHandleChangeServe).toHaveBeenLastCalledWith({ select: 0 });

    await userEvent.click(selectEle);
    await userEvent.click(options[2]);

    expect(mockHandleChangeServe).toHaveBeenLastCalledWith(expect.objectContaining({ split: [0, 0] }));
    expect(asFragment()).toMatchSnapshot();

    const textInputs = screen.getAllByRole('textbox');
    await userEvent.click(textInputs[0]);
    await userEvent.keyboard('50');
    await userEvent.click(textInputs[1]);
    await userEvent.keyboard('60');

    await userEvent.click(textInputs[0]);
    await userEvent.keyboard('{ctrl}{a}');

    await userEvent.keyboard('1');
    const down = document.querySelector('span.input-operation>.icon-angle-down');
    const up = document.querySelector('span.input-operation>.icon-angle-up');

    down && await userEvent.click(down);
    down && await userEvent.click(down);
    await userEvent.click(textInputs[0]);
    await userEvent.keyboard('{ctrl}{a}');
    await userEvent.keyboard('99');
    up && await userEvent.click(up);
    up && await userEvent.click(up);
    await userEvent.click(textInputs[0]);
    await userEvent.keyboard('{ctrl}{a}');
    await userEvent.keyboard('50');


    await userEvent.click(textInputs[1]);
    await userEvent.keyboard('{ctrl}{a}');

    await userEvent.keyboard('50');
    expect(mockHandleChangeServe).toHaveBeenLastCalledWith(expect.objectContaining({ split: [0, 10000] }));

    done();
  })();
});
