import { FC, useState } from 'react'
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

  const [peopleOptions] = useState<PeopleOptionType[]>(
    uniqBy<PeopleOptionType>(
      [...additionalPeople, ...people.map(({ name, phone }) => ({ name, phone }))],
      'phone',
    ),
  )

  const onChangePeople = (event: any, newValue: PeopleOptionType[]) => {
    setCurrentPeople(newValue)
  }

  const filterPeopleOptions = (
    options: PeopleOptionType[],
    params: FilterOptionsState<PeopleOptionType>,
  ) => {
    const filtered = filter(options, params)

    const { inputValue } = params
    const isExisting = options.some((option) => inputValue === option.phone)
    if (inputValue !== '' && !isExisting) {
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
            <MainLabel>{option.inputValue}</MainLabel>
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

const SubLabel = styled.span`
  color: #444444;
  line-height: 12px;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`
// temporarily added additional people with names
const additionalPeople: readonly PeopleOptionType[] = [
  {
    name: 'Eliza Wall',
    phone: '+38 (050) 912-50-62',
  },
  {
    name: null,
    phone: '+38 (050) 878-48-62',
  },
  {
    name: 'Doreen Hudson',
    phone: '+38 (097) 995-47-93',
  },
  {
    name: 'Shirley Rose',
    phone: '+38 (068) 867-44-23',
  },
  {
    name: 'Fitzpatrick Strong',
    phone: '+38 (067) 827-42-12',
  },
  {
    name: null,
    phone: '+38 (097) 995-55-82',
  },
  {
    name: 'Mcpherson Ferrell',
    phone: '+38 (068) 818-48-72',
  },
  {
    name: 'Doreen Hudson',
    phone: '+38 (068) 837-53-43',
  },
  {
    name: 'Ayers Ramsey',
    phone: '+38 (099) 949-59-53',
  },
  {
    name: 'Marquita Walker',
    phone: '+38 (098) 843-42-63',
  },
]
