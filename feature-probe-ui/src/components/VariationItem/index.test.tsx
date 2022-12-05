import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import VariationItem from '.';
import { hooksFormContainer, variationContainer } from 'pages/toggle/provider';
import { IntlWrapper } from 'components/utils/wrapper';
import { DOMRect } from '../utils/domRect';

jest.setTimeout(10000);
Range.prototype.getBoundingClientRect = jest.fn().mockReturnValue(new DOMRect(0, 0, 0, 0));
Range.prototype.getClientRects = jest.fn().mockReturnValue([new DOMRect(0, 0, 0, 0)]);
Element.prototype.getClientRects = jest.fn().mockReturnValue([new DOMRect(0, 0, 0, 0)]);

const Wrapper: React.FC = (props) => {
  return (
    <IntlWrapper>
      <hooksFormContainer.Provider>
        <variationContainer.Provider>{props.children}</variationContainer.Provider>
      </hooksFormContainer.Provider>
    </IntlWrapper>
  );
};

it('VariationItem snapshot', (done) => {
  (async () => {
    const { asFragment, rerender } = render(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={jest.fn()}
        handleInput={jest.fn()}
      />,
      {
        wrapper: Wrapper,
      }
    );
    expect(asFragment()).toMatchSnapshot();

    rerender(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="boolean"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={jest.fn()}
        handleInput={jest.fn()}
      />
    );
    expect(asFragment()).toMatchSnapshot();

    done();
  })();
});

test('VariationItem delete', (done) => {
  (async () => {
    const mockHandleDelete = jest.fn();
    render(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={mockHandleDelete}
        handleChangeVariation={jest.fn()}
        handleInput={jest.fn()}
      />,
      {
        wrapper: Wrapper,
      }
    );

    const ele = screen.getAllByRole('generic').pop();
    if (ele) await userEvent.click(ele);

    expect(mockHandleDelete).toBeCalled();
    done();
  })();
});

test('VariationItem input', (done) => {
  (async () => {
    const mockHandleInput = jest.fn();
    const mockHandleChange = jest.fn();
    const { rerender } = render(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="boolean"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={mockHandleChange}
        handleInput={mockHandleInput}
      />,
      {
        wrapper: Wrapper,
      }
    );

    const nameTextbox = screen.getByPlaceholderText('name');
    await userEvent.click(nameTextbox);
    await userEvent.keyboard('t');
    expect(mockHandleInput).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ value: 't' }));
    await userEvent.clear(nameTextbox);

    await userEvent.click(screen.getByPlaceholderText('description'));
    await userEvent.keyboard('d');
    expect(mockHandleInput).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ value: 'd' }));

    await userEvent.click(screen.getByText('Please select'));
    await userEvent.click(screen.getByRole('option', { selected: true }));
    expect(mockHandleChange).toHaveBeenCalledWith(expect.anything(), 'true');

    rerender(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="string"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={mockHandleChange}
        handleInput={mockHandleInput}
      />
    );

    await userEvent.click(screen.getByPlaceholderText('value'));
    await userEvent.keyboard('v');
    expect(mockHandleInput).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ value: 'v' }));

    done();
  })();
});

test('VariationItem number input', (done) => {
  (async () => {
    const mockHandleInput = jest.fn();
    const mockHandleChange = jest.fn();
    render(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="number"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={mockHandleChange}
        handleInput={mockHandleInput}
      />,
      {
        wrapper: Wrapper,
      }
    );

    await userEvent.click(screen.getByPlaceholderText('value'));
    await userEvent.keyboard('v');
    await userEvent.keyboard('{backspace}');
    await userEvent.keyboard('100');
    expect(mockHandleInput).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ value: '100' }));

    done();
  })();
});

test('VariationItem json modal', (done) => {
  (async () => {
    const mockHandleInput = jest.fn();
    const mockHandleChange = jest.fn();
    render(
      <VariationItem
        total={1}
        item={{ index: 1 }}
        returnType="json"
        prefix="drawer"
        hooksFormContainer={hooksFormContainer}
        handleDelete={jest.fn()}
        handleChangeVariation={mockHandleChange}
        handleInput={mockHandleInput}
      />,
      {
        wrapper: Wrapper,
      }
    );
    await userEvent.click(screen.getByPlaceholderText('value'));
    await userEvent.keyboard('{{');
    await userEvent.keyboard('}');
    expect(mockHandleInput).toHaveBeenLastCalledWith(expect.anything(), expect.objectContaining({ value: '{}' }));

    const jsonModalOpen = document.getElementsByClassName('icon-code')[0];
    expect(jsonModalOpen).not.toBeUndefined();
    await userEvent.click(jsonModalOpen);

    await userEvent.click(screen.getByText('Cancel'));

    await userEvent.click(jsonModalOpen);

    const textbox = screen.getAllByRole('textbox')[3];
    await userEvent.type(textbox, 'error text{{{{');
    expect(screen.getByText('Confirm')).toBeDisabled();

    await userEvent.clear(textbox);
    await userEvent.type(textbox, '{{}');

    await userEvent.click(screen.getByText('Confirm'));
    expect(mockHandleChange).toHaveBeenLastCalledWith(1, '{}');

    done();
  })();
});
