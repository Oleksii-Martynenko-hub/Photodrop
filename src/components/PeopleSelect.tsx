import { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { Box, Chip, FilterOptionsState, TextField, Typography } from '@mui/material'
import Autocomplete, {
  AutocompleteRenderGetTagProps,
  createFilterOptions,
} from '@mui/material/Autocomplete'

import { uniqBy } from 'utils/uniq-by'

import { selectPeople } from 'store/photos/selectors'

export interface PeopleOptionType {
  inputValue?: string
  name: string | null
  phone: string
}

interface Props {
  currentPeople: PeopleOptionType[]
  setCurrentPeople: React.Dispatch<React.SetStateAction<PeopleOptionType[]>>
}

const filter = createFilterOptions<PeopleOptionType>()

const PeopleSelect: FC<Props> = ({ currentPeople, setCurrentPeople }) => {
  const people = useSelector(selectPeople)

  const [isAdditionalPhoneValid, setIsAdditionalPhoneValid] = useState(false)
  const [peopleOptions, setPeopleOptions] = useState<PeopleOptionType[]>([])

  useEffect(() => {
    if (people.length)
      setPeopleOptions(
        uniqBy<PeopleOptionType>(
          [...additionalPeople, ...people.map(({ name, phone }) => ({ name, phone }))],
          'phone',
        ),
      )
  }, [people])

  const onChangePeople = (event: unknown, newValue: PeopleOptionType[]) => {
    setCurrentPeople(newValue)
    setIsAdditionalPhoneValid(true)
  }

  const filterPeopleOptions = (
    options: PeopleOptionType[],
    params: FilterOptionsState<PeopleOptionType>,
  ) => {
    const filtered = filter(options, params)

    const { inputValue } = params
    const isExisting = options.some((option) => inputValue === option.phone)
    if (inputValue !== '' && !isExisting) {
      const isInputValueValid = /^[0-9]{10,13}$/.test(inputValue)
      setIsAdditionalPhoneValid(isInputValueValid)

      filtered.push({
        name: null,
        phone: inputValue,
        inputValue: `Add "${inputValue}"`,
      })
    }

    return filtered
  }

  const getOptionLabel = (option: PeopleOptionType) => {
    if (option.inputValue) {
      return option.inputValue
    }
    return option.phone + (option.name || '')
  }

  const isOptionEqualToValue = (option: PeopleOptionType, value: PeopleOptionType) => {
    return option.phone === value.phone
  }

  const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: PeopleOptionType) => {
    return (
      <li {...props} key={option.name + option.phone}>
        <Box sx={{ pl: '6px', height: '38px' }}>
          {option.name ? (
            <MainLabel>
              {option.name}
              <SubLabel>{option.phone}</SubLabel>
            </MainLabel>
          ) : option.inputValue ? (
            <MainLabel>
              {option.inputValue}
              <SubLabel isValid={isAdditionalPhoneValid}>
                {isAdditionalPhoneValid ? '' : 'Phone number is not valid'}
              </SubLabel>
            </MainLabel>
          ) : (
            <MainLabel>{option.phone}</MainLabel>
          )}
        </Box>
      </li>
    )
  }

  const renderTags = (value: PeopleOptionType[], getTagProps: AutocompleteRenderGetTagProps) => {
    return value.map((option, index) => (
      // eslint-disable-next-line react/jsx-key
      <Chip
        variant={option.inputValue ? 'outlined' : 'filled'}
        label={option.name || option.phone}
        size='small'
        {...getTagProps({ index })}
      />
    ))
  }

  const getOptionDisabled = (option: PeopleOptionType) => {
    return Boolean(option.inputValue) && !isAdditionalPhoneValid
  }

  return (
    <Autocomplete
      multiple
      handleHomeEndKeys
      size='small'
      value={currentPeople}
      onChange={onChangePeople}
      options={peopleOptions}
      filterOptions={filterPeopleOptions}
      isOptionEqualToValue={isOptionEqualToValue}
      getOptionLabel={getOptionLabel}
      getOptionDisabled={getOptionDisabled}
      disableCloseOnSelect
      renderOption={renderOption}
      renderTags={renderTags}
      renderInput={(params) => (
        <TextField
          {...params}
          InputProps={{
            ...params.InputProps,
            sx: {
              borderRadius: '8px !important',
              backgroundColor: '#F4F4F4',
            },
          }}
          sx={{
            backgroundColor: '#F4F4F4',
            borderRadius: '8px !important',
            boxSizing: 'border-box',
          }}
          placeholder='People on photos'
        />
      )}
    />
  )
}

export default PeopleSelect

const MainLabel = styled(Typography)`
  color: #202020;
  line-height: 22px;
  font-size: 17px;
  display: block;
`

const SubLabel = styled.span<{ isValid?: boolean }>`
  color: ${({ isValid = true }) => (isValid ? '#444444' : 'red')};
  line-height: 12px;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`
// temporarily added additional people with names
const additionalPeople: readonly PeopleOptionType[] = [
  {
    name: 'Eliza Wall',
    phone: '380509125062',
  },
  {
    name: null,
    phone: '380508784862',
  },
  {
    name: 'Doreen Hudson',
    phone: '380979954793',
  },
  {
    name: 'Shirley Rose',
    phone: '380688674423',
  },
  {
    name: 'Fitzpatrick Strong',
    phone: '380678274212',
  },
  {
    name: null,
    phone: '380979955582',
  },
  {
    name: 'Mcpherson Ferrell',
    phone: '380688184872',
  },
  {
    name: 'Doreen Hudson',
    phone: '380688375343',
  },
  {
    name: 'Ayers Ramsey',
    phone: '380999495953',
  },
  {
    name: 'Marquita Walker',
    phone: '380988434263',
  },
]
